export default function FamousCard({ person }) {
  if (!person) return null;

  return (
    <div className="mb-5">
      <h2 className="text-4xl mb-2 underline leading-9">famous-specimens.db</h2>

      <div className="flex gap-4 bg-[#111] border border-[#E6FF00] p-4">

        <img
          src={person.imageUrl}
          alt={person.name}
          className="w-40 h-48 object-cover border border-[#E6FF00]"
        />

        <div className="text-sm">
          <p className="text-lg font-bold">{person.name}</p>
          <p>Profession: {person.profession}</p>
          <p>Country: {person.country}</p>
          <p className="mt-2">{person.whyFamous}</p>
          <p className="mt-2">
            Most Famous Work: <span className="font-bold">{person.mostFamousWork}</span>
          </p>
        </div>

      </div>
    </div>
  );
}
