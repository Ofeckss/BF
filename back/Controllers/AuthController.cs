using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back.Data;
using back.DTOs;
using back.Models;

namespace back.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _db;

    public AuthController(AppDbContext db)
    {
        _db = db;
    }

    [HttpPost("register")]
    public async Task<ActionResult<UsuarioResponse>> Register(RegisterRequest request)
    {
        if (await _db.Usuarios.AnyAsync(u => u.Correo == request.Correo))
        {
            return BadRequest(new { message = "Correo already in use." });
        }

        var usuario = new Usuario
        {
            Nombre = request.Nombre,
            Apellido = string.Empty,
            Edad = 0,
            NumeroCel = null,
            Correo = request.Correo,
            Rating = 0,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password)
        };

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();

        return CreatedAtAction(
            nameof(UsuariosController.GetById),
            "Usuarios",
            new { id = usuario.Id },
            usuario.ToResponse()
        );
    }

    [HttpPost("login")]
    public async Task<ActionResult<UsuarioResponse>> Login(LoginRequest request)
    {
        var usuario = await _db.Usuarios.SingleOrDefaultAsync(u => u.Correo == request.Correo);
        if (usuario == null || !BCrypt.Net.BCrypt.Verify(request.Password, usuario.PasswordHash))
        {
            return Unauthorized(new { message = "Correo or password is invalid." });
        }

        return Ok(usuario.ToResponse());
    }
}
