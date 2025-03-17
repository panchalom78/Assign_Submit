using System.ComponentModel.DataAnnotations.Schema;

namespace Server.Models;

public class Assignment{
    public int Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime? DueDate { get; set; }

    public int? UserId { get; set; }
    public User? User { get; set; }
}