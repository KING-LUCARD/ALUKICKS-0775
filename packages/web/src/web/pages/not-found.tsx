import { Link } from "wouter";

export default function NotFound() {
  return (
    <section className="px-gutter flex min-h-svh flex-col items-start justify-center pt-24">
      <p className="label text-infra">Error 404</p>
      <h1 className="display mt-4 text-[clamp(4rem,16vw,16rem)]">Lost<br /><span className="outline-text">stride.</span></h1>
      <Link to="/shop" className="btn btn-primary mt-10">Back to the collection →</Link>
    </section>
  );
}
