import { useState } from 'react';
import { CheckIcon, Combobox, Group, Pill, PillsInput, useCombobox } from '@mantine/core';

type CreatableMultiSelectProps = {
  allItems: string[];
  selectedItems: string[];
  onSelectedItemsChange: (value: string[]) => void;
  onCreateItem: (newValue: string) => void;
  placeholder?: string;
  displayValue?: (value: string) => string;
  normalizeForCompare?: (value: string) => string;
  displayMode?: 'preserve' | 'capitalize';
};

export function CreatableMultiSelect({
  allItems,
  selectedItems,
  onSelectedItemsChange,
  onCreateItem,
  placeholder,
  displayValue,
  normalizeForCompare,
  displayMode,
}: CreatableMultiSelectProps) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [search, setSearch] = useState('');
  const defaultNormalize = (s: string) => s.trim().toLowerCase();
  const capitalizeWords = (s: string) => s.replace(/\b\w/g, (m) => m.toUpperCase());

  const normalize = normalizeForCompare ?? defaultNormalize;

  const display =
    displayValue ??
    (displayMode === 'capitalize' ? (s: string) => capitalizeWords(s) : (s: string) => s);

  const trimmedSearchValue = search.trim();
  const normalizedSearchValue = normalize(trimmedSearchValue);

  const matchesExistingItem = allItems.some((item) => normalize(item) === normalizedSearchValue);
  const matchesSelectedItem = selectedItems.some(
    (item) => normalize(item) === normalizedSearchValue
  );
  const canCreate = trimmedSearchValue.length > 0 && !matchesExistingItem && !matchesSelectedItem;

  const handleItemSelect = (val: string) => {
    setSearch('');

    if (val === '$create') {
      if (!trimmedSearchValue) {
        return;
      }

      if (matchesExistingItem || matchesSelectedItem) {
        return;
      }

      onCreateItem(trimmedSearchValue);
      onSelectedItemsChange([...selectedItems, trimmedSearchValue]);
    } else {
      onSelectedItemsChange(
        selectedItems.includes(val)
          ? selectedItems.filter((v) => v !== val)
          : [...selectedItems, val]
      );
    }
  };

  const handleItemRemove = (val: string) =>
    onSelectedItemsChange(selectedItems.filter((v) => v !== val));

  const values = selectedItems.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleItemRemove(item)}>
      {display(item)}
    </Pill>
  ));

  const availableOptions = allItems
    .filter((item) => normalize(item).includes(normalizedSearchValue))
    .map((item) => (
      <Combobox.Option value={item} key={item} active={selectedItems.includes(item)}>
        <Group gap="sm">
          {selectedItems.includes(item) ? <CheckIcon size={12} /> : null}
          <span>{display(item)}</span>
        </Group>
      </Combobox.Option>
    ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleItemSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput onClick={() => combobox.openDropdown()}>
          <Pill.Group>
            {values}

            <Combobox.EventsTarget>
              <PillsInput.Field
                onFocus={() => combobox.openDropdown()}
                onBlur={() => combobox.closeDropdown()}
                value={search}
                placeholder={selectedItems.length === 0 ? placeholder : undefined}
                onChange={(event) => {
                  combobox.updateSelectedOptionIndex();
                  setSearch(event.currentTarget.value);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === 'Backspace' &&
                    search.length === 0 &&
                    selectedItems.length > 0
                  ) {
                    event.preventDefault();
                    handleItemRemove(selectedItems[selectedItems.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>
          {availableOptions}

          {canCreate && (
            <Combobox.Option value="$create">
              + Create {display(trimmedSearchValue)}
            </Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
