namespace Server.DTOs
{
    public class SubmissionWithStudentDTO
    {
        public int SubmissionId { get; set; }
        public string StudentName { get; set; }
        public DateTime SubmittedDate { get; set; }
        public int? Marks { get; set; }
        public string? Feedback { get; set; }
        public string SubmissionFile { get; set; }
    }
}