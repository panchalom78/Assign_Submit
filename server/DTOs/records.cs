namespace Server.DTOs
{
    public record CreateAssignmentRequest(int AssignmentId, string Title, string Description, string DueDate, string SubmittedOn, int ClassId);
    public class StudentAssignmentDTO
    {
        public int AssignmentId { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? DueDate { get; set; }
        public string? SubmittedOn { get; set; }
        public bool IsSubmitted { get; set; }
        public SubmissionDTO? Submission { get; set; }
    }

    public class SubmissionDTO
    {
        public int SubmissionId { get; set; }
        public int AssignmentId { get; set; }
        public DateTime SubmissionDate { get; set; }
        public int? Marks { get; set; }
        public string? Feedback { get; set; }
        public string? FilePath { get; set; }
    }

}
