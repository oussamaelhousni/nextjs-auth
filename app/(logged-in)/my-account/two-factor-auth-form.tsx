"use client";
import { get2fSecret } from "@/actions/get2fa-secret";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import React, { FormEvent, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { activate2fa } from "@/actions/activate2fa";
import { disable2fa } from "@/actions/disable2fa";
function TwoFactorAuthForm({
  twoFactorActivated,
}: {
  twoFactorActivated: boolean;
}) {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(twoFactorActivated);
  const [step, setStep] = useState(1);
  const [code, setCode] = useState("");
  const [otp, setOpt] = useState("");

  const enableTwoFactorAuth = async () => {
    const response = await get2fSecret();
    if (response.error) {
      toast({
        title: "Error Enabling two factor authentication",
        description: response.message,
      });
      return;
    }

    setCode(response.twoFactorSecret ?? "");

    setStep(2);
  };

  const handleSubmitOtp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await activate2fa(otp);

    if (response?.error) {
      return toast({
        title: "Error activating two factor authentication",
        description: response.message,
        variant: "destructive",
      });
    }

    toast({
      title: "Two factor authentication has been activated",
      className: "bg-green-500 text-white",
    });

    setCode("");
    setOpt("");
    setTwoFactorEnabled(true);
  };

  const handleDisbaleTwoFactor = async () => {
    const response = await disable2fa();

    if (response?.error) {
      return toast({
        title: "Error activating two factor authentication",
        description: response.message,
        variant: "destructive",
      });
    }
    toast({
      title: "Two factor authentication has been disbaled",
      className: "bg-green-500 text-white",
    });
    setTwoFactorEnabled(false);
  };
  return (
    <div>
      {!twoFactorEnabled && (
        <>
          {step === 1 && (
            <Button className="block w-full" onClick={enableTwoFactorAuth}>
              Enable two factor authentication
            </Button>
          )}

          {step === 2 && (
            <>
              <Separator />
              <div className="flex flex-col gap-4">
                <p className="text-xs text-muted-foreground py-2 text-center">
                  Scan Qr code below in the google authenticator app to activate
                  Two-Factor Authentication
                </p>
                <QRCodeSVG value={code} className="mx-auto" />

                <Button onClick={() => setStep(3)}>
                  I have scanned the code
                </Button>
                <Button variant="outline" onClick={() => setStep(1)}>
                  Cancel
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <Separator />
              <form className="flex flex-col gap-4" onSubmit={handleSubmitOtp}>
                <p className="text-xs text-muted-foreground py-2 text-center">
                  Please enter the one-time passcode from the Google auth app
                </p>
                <div className="flex justify-center">
                  <InputOTP
                    maxLength={6}
                    className="mx-auto w-full"
                    value={otp}
                    onChange={setOpt}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button type="submit">Submit and activate</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStep(1);
                    setOpt("");
                  }}
                >
                  Cancel
                </Button>
              </form>
            </>
          )}
        </>
      )}

      {twoFactorEnabled && (
        <Button className="w-full" onClick={handleDisbaleTwoFactor}>
          Disable two factor auth
        </Button>
      )}
    </div>
  );
}

export default TwoFactorAuthForm;
