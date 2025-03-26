using Server.Data;
using Server.Models;
using Microsoft.EntityFrameworkCore;
using Server.DTOs;

namespace Server.Services
{
    public class StudentService
    {
        private readonly UserDBContext _context;

        public StudentService(UserDBContext context)
        {
            _context = context;
        }

        public async Task<List<StudentAssignmentDTO>> GetStudentAssignments(int studentId)
        {
            try
            {
                // Get student info
                var student = await _context.Users
                    .FirstOrDefaultAsync(u => u.UserId == studentId);

                if (student == null)
                {
                    throw new Exception("Student not found");
                }

                if (student.ClassId == null)
                {
                    throw new Exception("Student is not assigned to any class");
                }

                // Get assignments
                var assignments = await _context.Assignments
                    .Where(a => a.ClassId == student.ClassId)
                    .ToListAsync();

                // Get submissions
                var submissions = await _context.Submissions
                    .Where(s => s.StudentId == studentId)
                    .ToListAsync();

                // Map to DTOs
                var assignmentDTOs = assignments.Select(a =>
                {
                    var submission = submissions.FirstOrDefault(s => s.AssignmentId == a.AssignmentId);
                    return new StudentAssignmentDTO
                    {
                        AssignmentId = a.AssignmentId,
                        Title = a.Title,
                        Description = a.Description,
                        DueDate = a.DueDate,
                        SubmittedOn = a.SubmittedOn,
                        IsSubmitted = submission != null,
                        Submission = submission != null ? new SubmissionDTO
                        {
                            SubmissionId = submission.SubmissionId,
                            AssignmentId = submission.AssignmentId,
                            SubmissionDate = submission.SubmissionDate,
                            Marks = submission.Marks,
                            Feedback = submission.Feedback,
                            FilePath = submission.FilePath
                        } : null
                    };
                }).ToList();

                return assignmentDTOs;
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to get assignments: {ex.Message}");
            }
        }
    }
}