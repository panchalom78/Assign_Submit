namespace Server.Models
{
    public class Submission
    {
        public int SubmissionId { get; set; }
        public string? FilePath { get; set; }         // Nullable
        public DateTime SubmissionDate { get; set; }
        public int? Marks { get; set; }
        public string? Feedback { get; set; }         // Nullable
        public int AssignmentId { get; set; }
        public Assignment? Assignment { get; set; }   // Nullable
        public int StudentId { get; set; }
        public User? Student { get; set; }            // Nullable
        public List<Remark>? Remarks { get; set; }    // Navigation property for remarks
    }
}