using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace back.Models;

[Table("compras")]
public class Compra
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("usuario_id")]
    public int UsuarioId { get; set; }

    [Column("fecha_compra")]
    public DateTime FechaCompra { get; set; } = DateTime.UtcNow;

    [Column("total")]
    public decimal Total { get; set; }

   
    [ForeignKey("UsuarioId")]
    public Usuario Usuario { get; set; } = null!;

    
    public List<CompraDetalle> Detalles { get; set; } = new List<CompraDetalle>();
}