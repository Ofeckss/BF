using BCrypt.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back.Data;
using back.Models;

namespace back.Controllers;

[ApiController]
[Route("[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly AppDbContext _db;

    public UsuariosController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IEnumerable<Usuario>> GetAll()
    {
        return await _db.Usuarios.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> GetById(int id)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario == null)
            return NotFound();

        return usuario;
    }

    [HttpPost]
    public async Task<ActionResult<Usuario>> Create(Usuario usuario)
    {
        if (!string.IsNullOrEmpty(usuario.Password))
        {
            usuario.PasswordHash = BCrypt.Net.BCrypt.HashPassword(usuario.Password);
        }

        _db.Usuarios.Add(usuario);
        await _db.SaveChangesAsync();

        return CreatedAtAction(nameof(GetById), new { id = usuario.Id }, usuario);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Usuario updatedUsuario)
    {
        if (id != updatedUsuario.Id)
            return BadRequest();

        var existing = await _db.Usuarios.FindAsync(id);
        if (existing == null)
            return NotFound();

        existing.Nombre = updatedUsuario.Nombre;
        existing.Apellido = updatedUsuario.Apellido;
        existing.Edad = updatedUsuario.Edad;
        existing.NumeroCel = updatedUsuario.NumeroCel;
        existing.Correo = updatedUsuario.Correo;
        existing.Rating = updatedUsuario.Rating;

        if (!string.IsNullOrEmpty(updatedUsuario.Password))
        {
            existing.PasswordHash = BCrypt.Net.BCrypt.HashPassword(updatedUsuario.Password);
        }

        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var usuario = await _db.Usuarios.FindAsync(id);
        if (usuario == null)
            return NotFound();

        _db.Usuarios.Remove(usuario);
        await _db.SaveChangesAsync();

        return NoContent();
    }
}
