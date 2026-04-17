export default function ScreenFrame({ children }) {
  return (
    <div className="w-screen h-screen flex items-center justify-center bg-zinc-950 overflow-hidden relative">
      {children}
    </div>
  );
}
