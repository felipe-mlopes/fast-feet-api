import { registerRecipient } from "@/data/actions/recipients";

import { Header } from "@/components/Header";
import { FormRecipient } from "@/components/recipient/FormRecipient";
import { Button } from "@/components/Button";

export default function Recipient() {
  return (
    <div className="p-6 min-h-screen space-y-16">
      <Header />
      <main className="min-h-screen">
        <FormRecipient action={registerRecipient}>
          <Button content="Registar o destinatário" type="submit" />
        </FormRecipient>
      </main>
    </div>
  );
}
