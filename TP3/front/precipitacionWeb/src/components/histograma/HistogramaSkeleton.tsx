export default function HistogramaSkeleton() {
  return (
    <div className="w-4/5 mx-auto my-12 flex justify-around items-end h-72 bg-gray-100 rounded-lg p-5">
      <div className="w-1/5 h-3/5 bg-gray-300 rounded animate-pulse"></div>
      <div className="w-1/5 h-3/5 bg-gray-300 rounded animate-pulse"></div>
      <div className="w-1/5 h-3/5 bg-gray-300 rounded animate-pulse"></div>
    </div>
  );
}