import Link from 'next/link'
import { User, MessageCircle, ShieldCheck } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      {/* Navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            EditoNiche
          </Link>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Accede Aquí
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-grow flex items-center justify-center text-center px-6 py-20">
        <div className="max-w-3xl">
          <h1 className="text-5xl font-extrabold mb-6">
            Conecta con editores de video expertos en tu nicho
          </h1>
          <p className="text-xl mb-8">
            Encuentra profesionales que entienden tu estilo y necesidades. Compara perfiles,
            revisa portfolios y colabora sin complicaciones.
          </p>
          <Link
            href="/login"
            className="inline-block bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-700 transition"
          >
            Accede Aquí
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div className="p-6 bg-gray-100 rounded-lg shadow flex flex-col items-center text-center">
            <User className="text-blue-600 mb-4" size={48} />
            <h3 className="text-2xl font-semibold mb-2">Para Clientes</h3>
            <p>
              Navega por la plataforma buscando y comparando editores según su experiencia,
              valoraciones y precios.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow flex flex-col items-center text-center">
            <MessageCircle className="text-blue-600 mb-4" size={48} />
            <h3 className="text-2xl font-semibold mb-2">Para Editores</h3>
            <p>
              Publica tu portfolio y trabajos recientes, haz ofertas personalizadas y atrae
              nuevos clientes.
            </p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow flex flex-col items-center text-center md:col-span-2">
            <ShieldCheck className="text-blue-600 mb-4" size={48} />
            <h3 className="text-2xl font-semibold mb-2">Pagos Seguros</h3>
            <p>
              Gestiona tus pagos desde la plataforma con total seguridad y confianza en cada
              transacción.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">¿Cómo Funciona?</h2>
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="text-blue-600 text-4xl font-bold mr-4">1</div>
              <div>
                <h4 className="text-xl font-semibold">Clientes</h4>
                <p>
                  Exploran la web, comparan editores según portfolios, reseñas y tarifas para
                  encontrar el mejor ajuste.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="text-blue-600 text-4xl font-bold mr-4">2</div>
              <div>
                <h4 className="text-xl font-semibold">Editores</h4>
                <p>
                  Publican su portfolio, muestran trabajos previos y envían ofertas competitivas
                  a los proyectos publicados.
                </p>
              </div>
            </div>
            <div className="flex flex-col md:flex-row items-start md:items-center">
              <div className="text-blue-600 text-4xl font-bold mr-4">3</div>
              <div>
                <h4 className="text-xl font-semibold">Colaboración</h4>
                <p>
                  Una vez aceptada la oferta, inician el trabajo y coordinan entregas y pagos
                  seguros desde la plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-400 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          &copy; {new Date().getFullYear()} EditoNiche. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}
