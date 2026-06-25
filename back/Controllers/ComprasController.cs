using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using back.Models;
using back.DTOs;
using back.Data;

namespace back.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComprasController : ControllerBase
{
    private readonly AppDbContext _context;

    public ComprasController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("usuario/{usuarioId}")]
    public async Task<IActionResult> GetHistorialByUsuario(int usuarioId)
    {
        
        var usuarioExiste = await _context.Usuarios.AnyAsync(u => u.Id == usuarioId);
        if (!usuarioExiste)
        {
            return NotFound(new { mensaje = "Usuario no encontrado" });
        }

        
        var historial = await _context.Compras
            .Where(c => c.UsuarioId == usuarioId)
            .Include(c => c.Detalles)
                .ThenInclude(d => d.Articulo)
            .OrderByDescending(c => c.FechaCompra)
            .Select(c => new CompraResponseDto
            {
                Id = c.Id,
                FechaCompra = c.FechaCompra,
                Total = c.Total,
                Detalles = c.Detalles.Select(d => new CompraDetalleDto
                {
                    
                    ArticuloNombre = d.Articulo.Nombre, 
                    Cantidad = d.Cantidad,
                    PrecioUnitario = d.PrecioUnitario
                }).ToList()
            })
            .ToListAsync();

        return Ok(historial);
    }
}