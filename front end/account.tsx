import { ActionButton, Card, Icon, SelectField } from "./shared"

export default function AccountPage({ notify }: { notify: (message: string) => void }) {
  return (
    <Card page="Account">
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-['Inter:Medium'] text-xs">Email address</p>
          <div className="mt-[7px] flex flex-wrap items-center gap-2.5">
            <span className="text-[13px] text-[#5c5e63]">maya.lin@gmail.com</span>
            <span className="flex items-center gap-1 rounded-full bg-[#eaf7f1] px-[7px] py-[3px] font-['Inter:Medium'] text-[10px] text-[#168565]"><Icon file="e1e21.svg" /> Verified</span>
          </div>
        </div>
        <ActionButton onClick={() => notify("Change email form opened")}>Change email</ActionButton>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <SelectField label="Language" icon="e5787.svg"><option>English (US)</option><option>English (UK)</option><option>Spanish</option></SelectField>
        <SelectField label="Time zone" icon="e5787.svg"><option>Pacific Time (Los Angeles)</option><option>Eastern Time (New York)</option><option>Greenwich Mean Time</option></SelectField>
      </div>
    </Card>
  )
}
