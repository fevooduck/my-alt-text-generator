import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';

// Instancie a API do Gemini com sua chave
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: NextRequest) {
  try {
    const { imageUrl, language } = await req.json();

    if (!imageUrl || !language) {
      return NextResponse.json({ error: 'URL da imagem e idioma são obrigatórios.' }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

    // Crie o prompt com base no idioma selecionado
    let promptText: string;
    if (language === "portugues") {
      promptText = "Descreva esta imagem de forma concisa e útil para um texto alternativo (alt text) em português. Foco nos elementos principais e no contexto da imagem. Comece a descrição com 'Imagem de' ou 'Uma imagem de'. Se houver texto, transcreva-o fielmente e mencione que é texto na imagem. Limite a 135 caracteres.";
    } else { // espanhol
      promptText = "Describe esta imagen de forma concisa y útil para un texto alternativo (alt text) en español. Concéntrate en los elementos principales y el contexto de la imagen. Empieza la descripción con 'Imagen de' o 'Una imagen de'. Si hay texto, transcríbelo fielmente y menciona que es texto en la imagen. Limite a 135 caracteres.";
    }

    const result = await model.generateContent([
      promptText,
      {
        inlineData: {
          data: Buffer.from(await fetch(imageUrl).then(res => res.arrayBuffer())).toString('base64'),
          mimeType: 'image/jpeg' // Ou determine dinamicamente se necessário
        }
      }
    ]);

    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ altText: text });

  } catch (error: any) {
    console.error("Erro na API:", error);
    // Erros específicos para tratamento de tokens bloqueados
    if (error.message.includes("SAFETY")) {
      return NextResponse.json(
        { error: "Conteúdo bloqueado por filtros de segurança do Gemini. Tente uma imagem diferente." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: 'Erro ao gerar texto alternativo: ' + error.message },
      { status: 500 }
    );
  }
}