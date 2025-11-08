namespace mc_backend;

public class User
{
    public int Id { get; set; }
    // Store Keycloak subject (sub) as string for stable user identification
    public string ExternalId { get; set; } = string.Empty;

    public ICollection<Server> Servers { get; set; } = new List<Server>();
}
