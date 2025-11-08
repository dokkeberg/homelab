using System.Net.Mime;

namespace mc_backend;

public class Server
{
    public int Id { get; set; }
    public ServerStatus Status { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;

    // Relationship
    public int OwnerId { get; set; }
    public User Owner { get; set; } = null!;
    
    public int ImageId { get; set; }
    public Image Image { get; set; } = null!;
    
}
