namespace Server.Models;

public class StudentAssignment
{
    public int Id { get; set; }
    public string? FileLink { get; set; }
    public DateTime UploadTime { get; set; }
    public int StudentId { get; set; }
    public User? Student { get; set; }
    public int AssignmentId { get; set; }
    public Assignment? Assignment { get; set; }
}