namespace back.Models;

public class Categoria
{
    public int Id {get; set;}
    public string Nombre {get; set;} = string.Empty;
    public int? ParentId {get; set;}

    public Categoria? Parent {get; set;}
    public ICollection<Categoria> Subcategorias { get; set; } = new List<Categoria>();
}