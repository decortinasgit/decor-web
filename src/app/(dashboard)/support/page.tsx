import React from "react";
import SupportForm from "./_components/support-form";
import FAQ from "./_components/support-faq";

type Props = {};

const SupportPage = (props: Props) => {
  return (
    <div className="flex flex-col gap-5 justify-start align-start lg:flex-row">
      <SupportForm />
      <FAQ />
    </div>
  );
};

export default SupportPage;
