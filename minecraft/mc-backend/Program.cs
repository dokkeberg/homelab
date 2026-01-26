using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text.Json;
using System.Text.Json.Serialization;
using mc_backend;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddOpenApi();

builder.Services.AddDbContext<McDbContext>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(opts =>
    {
        opts.MetadataAddress = builder.Configuration.GetValue<string>("Oidc:Issuer") + ".well-known/openid-configuration";
    	opts.RequireHttpsMetadata = true;
        opts.TokenValidationParameters = new TokenValidationParameters()
        {
            NameClaimType = "name",
            RoleClaimType = "role",
            ValidAudience = builder.Configuration.GetValue<string>("Oidc:Audience"),
            ValidIssuer = builder.Configuration.GetValue<string>("Oidc:Issuer")
        };

        if(builder.Environment.IsDevelopment())
        {
            opts.BackchannelHttpHandler = new HttpClientHandler
            {
                ServerCertificateCustomValidationCallback =
                    HttpClientHandler.DangerousAcceptAnyServerCertificateValidator
            };
        }
    });
builder.Services.AddAuthorization();

builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter(JsonNamingPolicy.CamelCase));
    options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<McDbContext>();
    dbContext.Database.Migrate();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();

var api = app.MapGroup("api");

var servers = api.MapGroup("servers");
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
        
        if(ownerId == 0)
        {
            var newUser = new User { ExternalId = userId };
            await db.Users.AddAsync(newUser);
            await db.SaveChangesAsync();
            ownerId = newUser.Id;
        }

        var server = new Server
        {
            Name = serverDto.Name,
            Description = serverDto.Description,
            ImageId = serverDto.ImageId,
            OwnerId = ownerId,
            Status = ServerStatus.Stopped
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


