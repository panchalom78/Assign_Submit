namespace Server.DTOs
{
    public class RemarkDTO
    {
        public int Id { get; set; }
        public int SubmissionId { get; set; }
        public int TeacherId { get; set; }
        public string Message { get; set; }
        public bool ResubmissionRequired { get; set; }
        public DateTime? ResubmissionDeadline { get; set; }
        public string TeacherName { get; set; }
        public string AssignmentTitle { get; set; }
    }
}