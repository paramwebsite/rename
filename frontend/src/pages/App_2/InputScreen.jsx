export default function InputScreen() {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-black">
      <img
        src="/static.gif"
        alt="glitch"
        className="h-full w-full object-cover"
        draggable={false}
      />
    </div>
  );
}