// src/components/AddressSearch/AddressSearch.tsx
import { useState, useEffect, useRef } from "react";
import styles from "./AddressSearch.module.scss";
import { fetchStreets, fetchHouses, fetchGroup } from "../../api/yasno/yasnoAddressApi";
import type { Street, House } from "../../api/yasno/yasnoAddressApi";

interface AddressSearchProps {
  regionId: number;
  dsoId: number;
  onGroupFound: (group: string) => void;
}

const STORAGE_KEYS = {
  street: "powergrid_address_street",
  house: "powergrid_address_house",
  group: "powergrid_address_group",
};

export const AddressSearch = ({ regionId, dsoId, onGroupFound }: AddressSearchProps) => {
  const [streetQuery, setStreetQuery] = useState("");
  const [houseQuery, setHouseQuery] = useState("");
  const [streets, setStreets] = useState<Street[]>([]);
  const [houses, setHouses] = useState<House[]>([]);
  const [selectedStreet, setSelectedStreet] = useState<Street | null>(null);
  const [selectedHouse, setSelectedHouse] = useState<House | null>(null);
  const [isStreetOpen, setIsStreetOpen] = useState(false);
  const [isHouseOpen, setIsHouseOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const streetRef = useRef<HTMLDivElement>(null);
  const houseRef = useRef<HTMLDivElement>(null);

  // Закриваємо dropdown при кліку поза ним
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (streetRef.current && !streetRef.current.contains(event.target as Node)) {
        setIsStreetOpen(false);
      }
      if (houseRef.current && !houseRef.current.contains(event.target as Node)) {
        setIsHouseOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Завантажуємо збережену адресу при монтуванні
  useEffect(() => {
    const savedStreet = localStorage.getItem(STORAGE_KEYS.street);
    const savedHouse = localStorage.getItem(STORAGE_KEYS.house);
    const savedGroup = localStorage.getItem(STORAGE_KEYS.group);

    if (savedStreet && savedHouse && savedGroup) {
      const street = JSON.parse(savedStreet);
      const house = JSON.parse(savedHouse);
      setSelectedStreet(street);
      setSelectedHouse(house);
      setStreetQuery(street.value);
      setHouseQuery(house.value);
      onGroupFound(savedGroup);
    }
  }, []);

  // Живий пошук вулиць (debounce 300ms)
  useEffect(() => {
    if (streetQuery.length < 2 || selectedStreet) {
      setStreets([]);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchStreets(regionId, dsoId, streetQuery).then((result) => {
        setStreets(result);
        setIsStreetOpen(true);
        setIsLoading(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [streetQuery, regionId, dsoId, selectedStreet]);

  // При кліку на поле будинку — завантажуємо ВСІ будинки (порожній query)
  const handleHouseFocus = async () => {
    if (!selectedStreet) return;
    if (houses.length > 0) {
      // Якщо вже завантажені — просто відкриваємо
      setIsHouseOpen(true);
      return;
    }

    setIsLoading(true);
    setError(null);

    const result = await fetchHouses(regionId, dsoId, selectedStreet.id, "");
    setHouses(result);
    setIsHouseOpen(true);
    setIsLoading(false);

    if (result.length === 0) {
      setError("Будинки не знайдено");
    }
  };

  // Живий пошук будинків, коли користувач вводить цифру (debounce 300ms)
  useEffect(() => {
    if (!selectedStreet || houseQuery.length < 1 || selectedHouse) {
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      fetchHouses(regionId, dsoId, selectedStreet.id, houseQuery).then((result) => {
        setHouses(result);
        setIsHouseOpen(true);
        setIsLoading(false);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [houseQuery, selectedStreet, regionId, dsoId, selectedHouse]);

  const handleStreetSelect = (street: Street) => {
    setSelectedStreet(street);
    setStreetQuery(street.value);
    setIsStreetOpen(false);
    setHouseQuery("");
    setSelectedHouse(null);
    setHouses([]); // Скидаємо будинки
    setError(null);
  };

  // Клік на будинок — одразу визначаємо групу
  const handleHouseSelect = async (house: House) => {
    if (!selectedStreet) return;

    setSelectedHouse(house);
    setHouseQuery(house.value);
    setIsHouseOpen(false);

    setIsLoading(true);
    setError(null);

    const groupInfo = await fetchGroup(regionId, selectedStreet.id, house.id, dsoId);

    if (groupInfo) {
      const groupKey = `${groupInfo.group}.${groupInfo.subgroup}`;

      localStorage.setItem(STORAGE_KEYS.street, JSON.stringify(selectedStreet));
      localStorage.setItem(STORAGE_KEYS.house, JSON.stringify(house));
      localStorage.setItem(STORAGE_KEYS.group, groupKey);

      onGroupFound(groupKey);
    } else {
      setError("Не вдалося визначити чергу для цієї адреси.");
    }

    setIsLoading(false);
  };

  const handleReset = () => {
    setSelectedStreet(null);
    setSelectedHouse(null);
    setStreetQuery("");
    setHouseQuery("");
    setStreets([]);
    setHouses([]);
    localStorage.removeItem(STORAGE_KEYS.street);
    localStorage.removeItem(STORAGE_KEYS.house);
    localStorage.removeItem(STORAGE_KEYS.group);
  };

  return (
    <div className={styles.addressSearch}>
      {/* Пошук вулиці */}
      <div ref={streetRef} className={styles.addressSearch__field}>
        <span className={styles.addressSearch__icon}>🏠</span>
        <input
          type="text"
          placeholder="Вулиця"
          value={streetQuery}
          onChange={(e) => {
            setStreetQuery(e.target.value);
            setSelectedStreet(null);
            setIsStreetOpen(true);
          }}
          onFocus={() => setIsStreetOpen(true)}
          className={styles.addressSearch__input}
        />

        {isStreetOpen && streets.length > 0 && (
          <div className={styles.addressSearch__dropdown}>
            {streets.map((street) => (
              <div
                key={street.id}
                className={styles.addressSearch__dropdownItem}
                onClick={() => handleStreetSelect(street)}
              >
                {street.value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Пошук будинку */}
      <div ref={houseRef} className={styles.addressSearch__field}>
        <span className={styles.addressSearch__icon}>🏢</span>
        <input
          type="text"
          placeholder="Будинок"
          value={houseQuery}
          onChange={(e) => {
            setHouseQuery(e.target.value);
            setSelectedHouse(null);
            setIsHouseOpen(true);
          }}
          onFocus={handleHouseFocus}
          disabled={!selectedStreet}
          className={styles.addressSearch__input}
        />

        {isHouseOpen && houses.length > 0 && (
          <div className={styles.addressSearch__dropdown}>
            {houses.map((house) => (
              <div
                key={house.id}
                className={styles.addressSearch__dropdownItem}
                onClick={() => handleHouseSelect(house)}
              >
                {house.value}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Кнопка скидання */}
      {selectedHouse && (
        <button className={styles.addressSearch__reset} onClick={handleReset}>
          ✕
        </button>
      )}

      {isLoading && (
        <div className={styles.addressSearch__status}>Пошук...</div>
      )}
      {error && <div className={styles.addressSearch__error}>{error}</div>}
    </div>
  );
};