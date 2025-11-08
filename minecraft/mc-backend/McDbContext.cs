using Microsoft.EntityFrameworkCore;

namespace mc_backend;

public class McDbContext : DbContext
{
    public DbSet<Server> Servers { get; set; } = default!;
    public DbSet<User> Users { get; set; } = default!;
    public DbSet<Image> Images { get; set; } = default!;

    public string DbPath { get; } = "Servers.db";

    protected override void OnConfiguring(DbContextOptionsBuilder options)
        => options.UseSqlite($"Data Source={DbPath}")
            .UseAsyncSeeding(async (context, _, ct) =>
            {
                if (context.Set<Server>().Any()) return;
                await DbSeeder.SeedAsync(context, ct);
            })
            .UseSeeding((context, _) =>
            {
                if (context.Set<Server>().Any()) return;
                DbSeeder.Seed(context);
            });
}