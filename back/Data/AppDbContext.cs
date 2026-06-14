using Microsoft.EntityFrameworkCore;
using back.Models;

namespace back.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Usuario> Usuarios { get; set; } = null!;
    public DbSet<Categoria> Categorias { get; set; } = null!;
    public DbSet<Articulo> Articulos { get; set; } = null!;

    public DbSet<Foto> Fotos { get; set;}
}
