
import { getCoverLetter } from "@/actions/cover-letter";
import CoverLetterPreview from "../_components/cover-letter-preview";


export default async function EditCoverLetterPage({ params }) {
  const { id } = await params;
  const coverLetter = await getCoverLetter(id);

  if (!coverLetter) return <div>Not Found</div>;

  return (
    <div className="container mx-auto py-6">
      <CoverLetterPreview 
        id={id} // This must be exactly like this
        content={coverLetter.content} 
        coverLetter={coverLetter} 
      />
    </div>
  );
}