namespace Server.Models
{
    public class Assignment
    {
        public int AssignmentId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public DateTime DueDate { get; set; }
        public int UserId { get; set; }
        public User? User { get; set; }
        public DateTime SubmittedOn { get; set; }
        public int ClassId { get; set; }
        public Class? Class { get; set; }
        public List<Submission>? Submissions { get; set; } // Updated
    }
}