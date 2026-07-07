import CustomSelect from './CustomSelect';

interface TrackSelectorProps {
  label?: string;
  applications: any[];
  selectedApp: any;
  onSelect: (app: any) => void;
}

export default function TrackSelector({
  label = "Select Target Track:",
  applications,
  selectedApp,
  onSelect
}: TrackSelectorProps) {
  const options = applications.map((app) => ({
    value: app,
    label: `${app.company} — ${app.role}`
  }));

  return (
    <CustomSelect
      label={label}
      options={options}
      value={selectedApp}
      onChange={onSelect}
      horizontal={true}
    />
  );
}
