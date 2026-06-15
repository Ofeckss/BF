using System.ComponentModel.DataAnnotations.Schema;

namespace back.Models;

[Table("fotos")]
public class Foto
{
    [Column("id")]
    public int Id { get; set; }

    [Column("articulo_id")]
    public int ArticuloId { get; set; }

    [Column("url")]
    public string Url { get; set; } = string.Empty;

    [Column("orden")]
    public byte Orden { get; set; }

    public Articulo? Articulo { get; set; }
}