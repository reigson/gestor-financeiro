import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const categorias = [
  "Alimentação", "Moradia", "Transporte", "Saúde", "Lazer",
  "Educação", "Compras pessoais", "Investimentos", "Imprevistos", "Assinaturas"
];
const ganhos = ["Salário", "Renda extra", "Renda passiva"];

export default function App() {
  const [registros, setRegistros] = useState([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  const [tipo, setTipo] = useState("gasto");
  const [categoria, setCategoria] = useState(categorias[0]);

  const adicionarRegistro = () => {
    if (!descricao || !valor || isNaN(Number(valor))) return;
    setRegistros([...registros, { descricao, valor: Number(valor), tipo, categoria }]);
    setDescricao(""); setValor("");
  };

  const gastosTotais = registros.filter(r => r.tipo === "gasto").reduce((a, b) => a + b.valor, 0);
  const ganhosTotais = registros.filter(r => r.tipo === "ganho").reduce((a, b) => a + b.valor, 0);
  const saldo = ganhosTotais - gastosTotais;

  const dadosGrafico = categorias.map(cat => {
    const total = registros.filter(r => r.tipo === "gasto" && r.categoria === cat).reduce((a, b) => a + b.valor, 0);
    return { name: cat, value: total };
  });

  const cores = ["#8884d8", "#8dd1e1", "#ffc658", "#a4de6c", "#d0ed57", "#82ca9d", "#ff8042", "#d885f2", "#f27b9b", "#90cdf4"];

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gestor Financeiro Pessoal</h1>
      <div className="mb-4 grid gap-2">
        <input placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className="p-2 border rounded"/>
        <input placeholder="Valor" value={valor} onChange={e => setValor(e.target.value)} className="p-2 border rounded"/>
        <select value={tipo} onChange={e => setTipo(e.target.value)} className="p-2 border rounded">
          <option value="gasto">Gasto</option>
          <option value="ganho">Ganho</option>
        </select>
        <select value={categoria} onChange={e => setCategoria(e.target.value)} className="p-2 border rounded">
          {(tipo === "ganho" ? ganhos : categorias).map((cat, idx) => (
            <option key={idx} value={cat}>{cat}</option>
          ))}
        </select>
        <button onClick={adicionarRegistro} className="p-2 bg-blue-600 text-white rounded">Adicionar</button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-2 border rounded">Ganhos: R$ {ganhosTotais.toFixed(2)}</div>
        <div className="p-2 border rounded">Gastos: R$ {gastosTotais.toFixed(2)}</div>
        <div className="p-2 border rounded">Saldo: R$ {saldo.toFixed(2)}</div>
      </div>

      <h2 className="text-xl font-semibold mb-2">Distribuição de Gastos</h2>
      <PieChart width={400} height={300}>
        <Pie data={dadosGrafico} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
          {dadosGrafico.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>

      <h2 className="text-xl font-semibold mt-6 mb-2">Registros</h2>
      <ul className="space-y-2">
        {registros.map((r, idx) => (
          <li key={idx} className="border p-2 rounded">
            {r.tipo === "ganho" ? "🟢" : "🔴"} <strong>{r.descricao}</strong> - R$ {r.valor.toFixed(2)} ({r.categoria})
          </li>
        ))}
      </ul>
    </div>
  );
}
