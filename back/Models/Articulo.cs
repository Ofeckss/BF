using System.ComponentModel.DataAnnotations.Schema;

namespace back.Models;

[Table("articulos")]
public class Articulo
{
    [Column("id")]
    public int Id { get; set; }

    [Column("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("vendedor_id")]
    public int VendedorId { get; set; }

    [Column("categoria_id")]
    public int CategoriaId { get; set; }

    [Column("precios")]
    public decimal? Precio { get; set; }

    [Column("trueque")]
    public bool EsTrueque { get; set; }

    [Column("fecha_publicacion")]
    public DateOnly? FechaPublicacion { get; set; }

    [Column("ubicacion")]
    public string Ubicacion { get; set; } = string.Empty;

    [Column("disponible")]
    public bool Disponible { get; set; }

    public Categoria? Categoria { get; set; }
    public ICollection<Foto> Fotos { get; set; } = new List<Foto>();
}