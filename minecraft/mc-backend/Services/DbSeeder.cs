using Microsoft.EntityFrameworkCore;

namespace mc_backend;

public static class DbSeeder
{
    public static async Task SeedAsync(DbContext db, CancellationToken ct = default)
    {
        var users = new List<User>
        {
            new User { Id = 1, ExternalId = "52ccc561-ee7f-4dcb-aef1-a18021695ac5" },
            new User { Id = 2, ExternalId = "22222222-2222-2222-2222-222222222222" }
        };
        await db.Set<User>().AddRangeAsync(users, ct);
        await db.SaveChangesAsync(ct);

        var images = new List<Image>
        {
            new Image { Id = 1, Url = "https://picsum.photos/seed/mc-overworld/800/450" },
            new Image { Id = 2, Url = "https://picsum.photos/seed/mc-nether/800/450" },
            new Image { Id = 3, Url = "https://picsum.photos/seed/mc-creative/800/450" }
        };
        await db.Set<Image>().AddRangeAsync(images, ct);
        await db.SaveChangesAsync(ct);

        var servers = new List<Server>
        {
            new Server { Id = 1, Status = ServerStatus.Running, Name = "Overworld Alpha", Description = "Primary survival world server.", OwnerId = users[0].Id, ImageId = images[0].Id },
            new Server { Id = 2, Status = ServerStatus.Stopped, Name = "Nether Nexus", Description = "Experimental nether-only instance.", OwnerId = users[0].Id, ImageId = images[1].Id },
            new Server { Id = 3, Status = ServerStatus.Running, Name = "Creative Hub", Description = "Flat world for creative builds.", OwnerId = users[1].Id, ImageId = images[2].Id },
            new Server { Id = 4, Status = ServerStatus.Stopped, Name = "Skyblock Beta", Description = "Skyblock challenge environment.", OwnerId = users[1].Id, ImageId = images[0].Id },
            new Server { Id = 5, Status = ServerStatus.Running, Name = "Modded Forge", Description = "Forge modpack playground.", OwnerId = users[1].Id, ImageId = images[1].Id }
        };

        await db.Set<Server>().AddRangeAsync(servers, ct);
        await db.SaveChangesAsync(ct);
    }

    public static void Seed(DbContext context)
    {
        if (context.Set<User>().Any() || context.Set<Server>().Any())
            return;

        var users = new List<User>
        {
            new User { Id = 1, ExternalId = "52ccc561-ee7f-4dcb-aef1-a18021695ac5" },
            new User { Id = 2, ExternalId = "22222222-2222-2222-2222-222222222222" }
        };
        context.Set<User>().AddRange(users);
        context.SaveChanges();

        var images = new List<Image>
        {
            new Image { Id = 1, Url = "https://picsum.photos/seed/mc-overworld/800/450" },
            new Image { Id = 2, Url = "https://picsum.photos/seed/mc-nether/800/450" },
            new Image { Id = 3, Url = "https://picsum.photos/seed/mc-creative/800/450" }
        };
        context.Set<Image>().AddRange(images);
        context.SaveChanges();

        var servers = new List<Server>
        {
            new Server { Id = 1, Status = ServerStatus.Running, Name = "Overworld Alpha", Description = "Primary survival world server.", OwnerId = users[0].Id, ImageId = images[0].Id },
            new Server { Id = 2, Status = ServerStatus.Stopped, Name = "Nether Nexus", Description = "Experimental nether-only instance.", OwnerId = users[0].Id, ImageId = images[1].Id },
            new Server { Id = 3, Status = ServerStatus.Running, Name = "Creative Hub", Description = "Flat world for creative builds.", OwnerId = users[1].Id, ImageId = images[2].Id },
            new Server { Id = 4, Status = ServerStatus.Stopped, Name = "Skyblock Beta", Description = "Skyblock challenge environment.", OwnerId = users[1].Id, ImageId = images[0].Id },
            new Server { Id = 5, Status = ServerStatus.Running, Name = "Modded Forge", Description = "Forge modpack playground.", OwnerId = users[1].Id, ImageId = images[1].Id }
        };

        context.Set<Server>().AddRange(servers);
        context.SaveChanges();
    }
}
