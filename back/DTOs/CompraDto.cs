using System;
using System.Collections.Generic;

namespace back.DTOs;

public class CompraResponseDto
{
    public int Id { get; set; }
    public DateTime FechaCompra { get; set; }
    public decimal Total { get; set; }
    public List<CompraDetalleDto> Detalles { get; set; } = new List<CompraDetalleDto>();
}

public class CompraDetalleDto
{
    public string ArticuloNombre { get; set; } = null!;
    public int Cantidad { get; set; }
    public decimal PrecioUnitario { get; set; }
}