namespace back.Models;

public class Foto
{
    public int Id {get; set;}
    public int ArticuloId {get; set;}
    public string Url {get; set;} = string.Empty;
    public byte Orden {get; set;}

    public Articulo? Articulo {get; set;}
}