using System.ComponentModel.DataAnnotations.Schema;

namespace back.Models;

[Table("categorias")]
public class Categoria
{
    [Column("id")]
    public int Id { get; set; }

    [Column("nombre")]
    public string Nombre { get; set; } = string.Empty;

    [Column("padre_id")]
    public int? ParentId { get; set; }

    public Categoria? Parent { get; set; }
    public ICollection<Categoria> Subcategorias { get; set; } = new List<Categoria>();
}