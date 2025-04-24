namespace Server.Models
{
    
public class Remark
{
    public int Id { get; set; }
    
    public int SubmissionId { get; set; }
    public Submission Submission { get; set; }
    
    public int UserId { get; set; }
    public  User? User { get; set; }
    
    
    public string Message { get; set; }
    
    public bool ResubmissionRequired { get; set; }
    
    public DateTime? ResubmissionDeadline { get; set; }
    
    
}
}