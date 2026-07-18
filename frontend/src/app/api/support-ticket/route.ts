const supportEmail = process.env.SUPPORT_TICKET_TO_EMAIL;

type FormSubmitResponse = {
  success?: boolean;
  message?: string;
};

const readFormSubmitResponse = async (response: Response): Promise<FormSubmitResponse> => {
  const data: unknown = await response.json().catch(() => null);

  if (data && typeof data === 'object') {
    const formSubmitData = data as { success?: unknown; message?: unknown };
    const success =
      typeof formSubmitData.success === 'boolean'
        ? formSubmitData.success
        : formSubmitData.success === 'true'
          ? true
          : formSubmitData.success === 'false'
            ? false
            : undefined;
    const message =
      typeof formSubmitData.message === 'string'
        ? formSubmitData.message
        : undefined;

    return { success, message };
  }

  return {};
};

export async function POST(request: Request) {
  if (!supportEmail) {
    return Response.json(
      { error: 'Support email is not configured.' },
      { status: 500 }
    );
  }

  let payload: {
    name?: string;
    email?: string;
    school?: string;
    message?: string;
  };

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = payload.name?.trim() ?? '';
  const email = payload.email?.trim().toLowerCase() ?? '';
  const school = payload.school?.trim() ?? '';
  const message = payload.message?.trim() ?? '';

  if (!name || !email || !school || !message) {
    return Response.json({ error: 'Fill out every field.' }, { status: 400 });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email.' }, { status: 400 });
  }

  let response: Response;
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('school', school);
  formData.append('message', message);
  formData.append('_subject', `NearU school request: ${school}`);
  formData.append('_template', 'table');
  formData.append('_captcha', 'false');

  try {
    const origin = new URL(request.url).origin;

    response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(supportEmail)}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Origin: origin,
        Referer: `${origin}/support-ticket`,
      },
      body: formData,
    });
  } catch {
    return Response.json(
      { error: 'Email service is unreachable.' },
      { status: 502 }
    );
  }

  const details = await readFormSubmitResponse(response);

  if (!response.ok || details.success === false) {
    const errorMessage = details.message ?? 'Could not send request.';

    return Response.json(
      { error: errorMessage },
      { status: 502 }
    );
  }

  const successMessage = details.message ?? 'Request sent.';

  return Response.json({ ok: true, message: successMessage });
}
