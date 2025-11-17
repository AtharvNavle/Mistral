import { decodeSharePayload } from "@/lib/share";
import { ShareableThread } from "@/types/share";
import { formatDateLabel, formatTimeLabel } from "@/lib/dates";

interface SharePageProps {
  params: { payload: string };
}

export default function SharePage({ params }: SharePageProps) {
  let data: ShareableThread | null = null;

  try {
    data = decodeSharePayload(params.payload);
  } catch (error) {
    console.error(error);
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-3xl border border-red-200 bg-white p-6 text-center">
          <p className="text-lg font-semibold text-red-600">
            Invalid share link
          </p>
          <p className="mt-2 text-sm text-zinc-600">
            The conversation payload could not be decoded. Request a fresh link
            from the sender.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <header className="border-b border-zinc-200 pb-4">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Mentor Lounge share
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-zinc-900">
            {data.title}
          </h1>
          <p className="mt-2 text-sm text-zinc-600">
            {data.persona.name} · {data.persona.tagline}
          </p>
        </header>

        <section className="mt-6 space-y-4">
          {data.messages.length === 0 ? (
            <p className="text-sm text-zinc-600">
              No messages captured in this share.
            </p>
          ) : (
            data.messages.map((message, index) => {
              const isUser = message.role === "user";
              return (
                <div
                  key={`${message.createdAt}-${index}`}
                  className={`flex w-full ${
                    isUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xl rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      isUser
                        ? "bg-zinc-900 text-white"
                        : "bg-white text-zinc-900 border border-zinc-200"
                    }`}
                  >
                    <p className="whitespace-pre-line">{message.content}</p>
                    <p className="mt-2 text-xs opacity-60">
                      {formatDateLabel(message.createdAt)} ·{" "}
                      {formatTimeLabel(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </section>

        {data.summary && data.summary.length > 0 && (
          <section className="mt-8 rounded-2xl bg-zinc-50 p-4">
            <p className="text-sm font-semibold text-zinc-900">
              Summary highlights
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-700">
              {data.summary.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  );
}

