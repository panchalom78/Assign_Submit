using Microsoft.AspNetCore.Mvc;
using Server.Data;

namespace Server.Controllers;

[ApiController]
[Route("api/[controller]")]

public class StudentAssignmentController : ControllerBase{
    private readonly UserDBContext _context ;
    public StudentAssignmentController(UserDBContext context){
        _context = context;
    }

    
}