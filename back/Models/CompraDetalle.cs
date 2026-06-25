using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back.Models;

[Table("compra_detalles")]
public class CompraDetalle
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("compra_id")]
    public int CompraId { get; set; }

    [Column("articulo_id")]
    public int ArticuloId { get; set; }

    [Column("cantidad")]
    public int Cantidad { get; set; }

    [Column("precio_unitario")]
    public decimal PrecioUnitario { get; set; }

    [ForeignKey("CompraId")]
    public Compra Compra { get; set; } = null!;

    [ForeignKey("ArticuloId")]
    public Articulo Articulo { get; set; } = null!;
}