type RoomBackgroundProps = {
  image: string;
  overlay?: string;
  blur?: boolean;
};

export default function RoomBackground({
  image,
  overlay = "from-gray-950/95 via-gray-950/80 to-gray-950/95",
  blur = false,
}: RoomBackgroundProps) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <img
        src={image}
        alt=""
        className={`h-full w-full object-cover ${blur ? "blur-sm" : ""}`}
      />
      <div
        className={`absolute inset-0 bg-gradient-to-b ${overlay}`}
      />
    </div>
  );
}
