export default function MenuItem({ name, price }) {
  return (
    <div className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer transition">
      <h3 className="font-semibold">{name}</h3>
      <p className="text-gray-500">{price.toLocaleString()}đ</p>
    </div>
  );
}
