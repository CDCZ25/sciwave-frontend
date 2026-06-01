const categoryColors: Record<string, string> = {
    // Ambiental - verde
    'Ciencias Ambientales': 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    'Ciências Ambientais': 'text-emerald-300 bg-emerald-400/10 border-emerald-400/20',
    // Física - rojo
    'Ciencias Físicas': 'text-rose-300 bg-rose-400/10 border-rose-400/20',
    'Ciências Físicas': 'text-rose-300 bg-rose-400/10 border-rose-400/20',
    // Computación - azul
    'Computación': 'text-indigo-300 bg-indigo-400/10 border-indigo-400/20',
    'Computação': 'text-indigo-300 bg-indigo-400/10 border-indigo-400/20',
};

const defaultColor = 'text-cyan-300 bg-cyan-400/10 border-cyan-400/20';

export function getCategoryColor(name: string): string {
    return categoryColors[name] ?? defaultColor;
}