export default function ChartContainer({ title, children }) {
  return (
    <div className="w-4/5 mx-auto mt-12 bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-center text-2xl mb-5 font-semibold">{title}</h2>
      <div className="w-full h-72">{children}</div>
    </div>
  );
}