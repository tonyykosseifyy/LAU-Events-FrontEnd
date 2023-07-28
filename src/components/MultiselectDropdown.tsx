import { TouchableOpacity, View } from 'react-native';
import TextWrapper from './TextWrapper';
import { useState } from 'react';
import ArrowRight from '../../assets/Icons/arrow_right.svg';
import { Club } from '../models/club';
import clsx from 'clsx';
import { ScrollView } from 'react-native-gesture-handler';

export interface MultiselectDropdownProps<T> {
  options: Club[];
  onChange: (selectedOptions: Club[]) => void;
  selectedOptions: Club[];
}

const MultiselectDropdown = ({
  options,
  onChange,
  selectedOptions,
}: MultiselectDropdownProps<Club>) => {
  const toggleOption = (option: Club) => {
    if (selectedOptions.find((i) => i.clubName === option.clubName)) {
      onChange(selectedOptions.filter((i) => i.clubName !== option.clubName));
    } else {
      onChange([...selectedOptions, option]);
    }
  };

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View className="z-30">
      <TouchableOpacity
        onPress={() => setShowDropdown(!showDropdown)}
        onBlur={() => setShowDropdown(false)}
        className="flex-row justify-between items-center p-3 bg-white border-gray-300 border-[1px] rounded-md ">
        <TextWrapper
          className={clsx(
            'text-s, text-black',
            selectedOptions.length > 0 ? 'text-black' : 'text-gray-400'
          )}>
          {selectedOptions.length > 0
            ? selectedOptions.map((i) => i.clubName).join(', ')
            : 'Select Clubs'}
        </TextWrapper>
        <ArrowRight width={12} height={12} rotation={90} color="#AAAAAA" />
      </TouchableOpacity>

      {showDropdown && (
        <View className="bg-white border-gray-300 border-[1px] rounded-md absolute top-12 right-0 left-0 p-1 z-10">
          {options.map((option) => (
            <TouchableOpacity
              key={option.clubName}
              onPress={() => toggleOption(option)}
              className="flex-row items-center p-3 bg-white border-gray-100 border-[1px] rounded-md">
              {selectedOptions.find((i) => {
                return i.clubName === option.clubName;
              }) && (
                <>
                  <ArrowRight width={15} height={15} color="#006E58" />
                  <View className="w-2" />
                </>
              )}
              <TextWrapper
                className={clsx(
                  selectedOptions.find((i) => {
                    return i.clubName === option.clubName;
                  })
                    ? 'text-brand'
                    : 'text-black'
                )}>
                {option.clubName}
              </TextWrapper>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default MultiselectDropdown;
