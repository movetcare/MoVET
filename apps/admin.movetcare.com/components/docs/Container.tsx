export default function Container({ children }: any) {
  return (
    <div className="container mx-auto p-8 bg-white rounded-lg w-full">
      {children}
    </div>
  );
}
