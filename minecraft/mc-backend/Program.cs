using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text.Json;
using System.Text.Json.Serialization;
using mc_backend;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Example: 'Bearer {token}'",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});

builder.Services.AddDbContext<McDbContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.MetadataAddress = builder.Configuration.GetValue<string>("Oidc:Issuer") + "/.well-known/openid-configuration";
    	opts.RequireHttpsMetadata = builder.Configuration.GetValue<bool>("Oidc:RequireHttpsMetadata");
        opts.TokenValidationParameters = new TokenValidationParameters()
        {
            NameClaimType = "name",
            RoleClaimType = "role",
            ValidAudience = builder.Configuration.GetValue<string>("Oidc:Audience")
        };
    });
builder.Services.AddAuthorization();

// Serialize enums as strings in camelCase for JSON responses
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
});

var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Serve OpenAPI document at /openapi/v1.json (built-in)
    app.MapOpenApi();

    // Serve Swagger UI at /swagger
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

var servers = app.MapGroup("servers");
servers.RequireAuthorization();
servers.MapGet("/", (ClaimsPrincipal user, McDbContext db, int? id) =>
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Results.Unauthorized();

        var query = db.Servers
            .Include(s => s.Image)
            .Where(s => s.Owner.ExternalId == userId);
        
        if(id is not null) 
            query = query.Where(s => s.Id == id);
        
        return Results.Ok(query.Select(s => 
            new ServerDto(s.Id, s.Name, s.Description, s.Image.Url, s.Status)));
    })
    .WithName("GetServers")
    .WithSummary("Gets a servers for your user.");

servers.MapGet("/create", (ClaimsPrincipal user, McDbContext db) =>
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Results.Unauthorized();

        return Results.Ok(new { images = db.Images});
    })
    .WithName("GetServerModel")
    .WithSummary("Gets model for registering new server.");

servers.MapPost("/", async (ClaimsPrincipal user, McDbContext db, CreateServerDto serverDto) =>
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Results.Unauthorized();

        var ownerId = await db.Users
            .Where(s => s.ExternalId == userId)
            .Select(u => u.Id)
            .FirstOrDefaultAsync();
        
        var server = new Server
        {
            Name = serverDto.Name,
            Description = serverDto.Description,
            ImageId = serverDto.ImageId,
            OwnerId = ownerId
        };
        
        await db.Servers.AddAsync(server);
        await db.SaveChangesAsync();
        
        return Results.Created($"servers/{server.Id}", server);
    })
    .WithName("CreateServer")
    .WithSummary("Create a new server for your user.");

servers.MapDelete("/{id:int}", async (ClaimsPrincipal user, McDbContext db, int id) =>
    {
        var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
        if (userId is null) return Results.Unauthorized();

        var res = await db.Servers
            .Where(s => s.Owner.ExternalId == userId && s.Id == id)
            .ExecuteDeleteAsync();
        
        await db.SaveChangesAsync();
        
        return res > 0 ? Results.Ok() : Results.NotFound();
    })
    .WithName("DeleteServer")
    .WithSummary("Delete one of your servers.");
app.Run();


