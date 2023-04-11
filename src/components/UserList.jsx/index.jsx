import React, { useState } from "react";
import { HiOutlineTrash } from "react-icons/hi";
import { BiCaretDown, BiCaretUp, BiHide, BiShowAlt } from "react-icons/bi";

export default function UserList() {
  const [people, setPeople] = useState([
    {
      id: 1,
      name: "John Doe",
      username: "johndoe",
      email: "johndoe@example.com",
      address: "1234 Elm Street - Los Angeles - 90001",
      children: [
        {
          id: 11,
          name: "John xx",
          username: "johndoe",
          email: "johndoe@example.com",
          address: "1234 Elm Street - Los Angeles - 90001",
          children: [
            {
              id: 111,
              name: "John Doe",
              username: "johndoe",
              email: "johndoe@example.com",
              address: "1234 Elm Street - Los Angeles - 90001",
            },
          ],
        },
      ],
    },
    {
      id: 2,
      name: "Jane Smith",
      username: "janesmith",
      email: "janesmith@example.com",
      address: "5678 Oak Avenue - New York - 10001",
    },
    {
      id: 3,
      name: "David Johnson",
      username: "davidjohnson",
      email: "davidjohnson@example.com",
      address: "9101 Pine Road - Chicago - 60601",
      children: [
        {
          id: 33,
          name: "John Doe2",
          username: "johndoe",
          email: "johndoe@example.com",
          address: "1234 Elm Street - Los Angeles - 90001",
        },
        {
          id: 332,
          name: "John Doe2",
          username: "johndoe",
          email: "johndoe@example.com",
          address: "1234 Elm Street - Los Angeles - 90001",
        },
      ],
    },
    {
      id: 4,
      name: "Sarah Williams",
      username: "sarahwilliams",
      email: "sarahwilliams@example.com",
      address: "2468 Maple Street - San Francisco - 94101",
    },
    {
      id: 5,
      name: "Michael Brown",
      username: "michaelbrown",
      email: "michaelbrown@example.com",
      address: "3690 Washington Avenue - Boston - 02101",
    },
  ]);

  const [isAscending, setIsAscending] = useState(true);
  const [query, setQuery] = useState("");

  const sortTable = (title) => {
    let data = [];
    if (isAscending === true) {
      data = [...people].sort((a, b) => (a[title] < b[title] ? -1 : 1));
    } else {
      data = [...people].sort((a, b) => (a[title] > b[title] ? -1 : 1));
    }
    setPeople(data);
    setIsAscending((prevState) => !prevState);
  };
  const [openStates, setOpenStates] = useState({});

  const toggleOpen = (id) => {
    setOpenStates((prevState) => {
      return {
        ...prevState,
        [id]: !prevState[id],
      };
    });
  };

  const handleChange = (e, personId, property) => {
    const updatedPeople = [...people];

    const findNodeById = (data, personId) => {
      for (const node of data) {
        if (node.id === personId) {
          return node;
        } else if (node.children && node.children.length > 0) {
          const found = findNodeById(node.children, personId);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };

    const node = findNodeById(updatedPeople, personId);
    if (node) {
      node[property] = e.target.value;
      setPeople(updatedPeople);
    }
  };

  const searchPeople = (people, query) => {
    const filteredPeople = people.filter((person) =>
      Object.keys(person).some((key) => {
        if (key === "id") {
          return person[key] == query;
        } else if (typeof person[key] === "string") {
          return person[key].toLowerCase().includes(query);
        } else if (Array.isArray(person[key])) {
          return searchPeople(person[key], query).length > 0;
        }
        return false;
      })
    );

    return filteredPeople;
  };
  const filteredPeople = searchPeople(people, query);

  const Tab = ({ pep, level }) => {
    const indent = level * 5;

    return (
      <>
        {pep.length !== 0 ? (
          pep.map((p) => (
            <React.Fragment key={p.id}>
              <tr
                className={`hover:bg-pink-200 cursor-pointer rounded-lg ${
                  p.children && p.children.length > 0 ? "cursor-pointer" : ""
                } ${
                  openStates[p.id]
                    ? "bg-gray-200"
                    : p.children
                    ? "bg-yellow-200"
                    : ""
                }`}
              >
                {Object.entries(p).map(([key, value], i) => {
                  if (key === "children" && Array.isArray(value)) {
                    return (
                      <td key={i}>
                        {value.length > 0 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleOpen(p.id);
                            }}
                            className={`focus:outline-none flex justify-center items-center rounded-lg px-2 ${
                              openStates[p.id] ? "bg-red-500" : "bg-green-500"
                            }`}
                          >
                            {openStates[p.id] ? <BiHide /> : <BiShowAlt />}
                          </button>
                        )}
                      </td>
                    );
                  } else {
                    return (
                      <td
                        key={i}
                        style={{ paddingLeft: `${indent}px` }}
                        className="py-2"
                      >
                        {typeof value !== "object" && value !== null && (
                          <input
                            defaultValue={value}
                            onBlur={(e) => handleChange(e, p.id, key)}
                            className="focus:outline-none rounded-lg border border-gray-400 px-2 py-1"
                          />
                        )}
                      </td>
                    );
                  }
                })}
              </tr>
              {p.children && p.children.length > 0 && openStates[p.id] && (
                <Tab pep={p.children} level={level + 1} />
              )}
            </React.Fragment>
          ))
        ) : (
          <tr>
            <td colSpan="5">No results found</td>
          </tr>
        )}
      </>
    );
  };

  return (
    <div className="text-xl w-[80%] m-10">
      <input
        type="text"
        className="pr-10 text-gray-700 border-black bg-white bg-clip-padding border-2 border-solid w-96 rounded-lg"
        id="fname"
        name="fname"
        placeholder=""
        value={query}
        onChange={(e) => setQuery(e.target.value.toLowerCase())}
      />
      {query !== "" && (
        <button
          className="text-red-500 font-bold ml-4"
          onClick={() => setQuery("")}
        >
          <HiOutlineTrash />
        </button>
      )}
      <table className="mt-10 w-full rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-gray-100 text-gray-700">
            {people.length !== 0 &&
              Object.keys(people[0]).map((p, index) => {
                if (p !== "children") {
                  return (
                    <th
                      className="capitalize text-start cursor-pointer px-4 py-2"
                      key={index}
                      onClick={() => sortTable(p)}
                    >
                      <div className="flex items-center">
                        {p}
                        <div className="flex flex-col text-xs ml-1 mt-1">
                          <BiCaretUp />
                          <BiCaretDown />
                        </div>
                      </div>
                    </th>
                  );
                }
              })}
          </tr>
        </thead>
        <tbody>
          <Tab pep={filteredPeople} level={0} />
        </tbody>
      </table>
    </div>
  );
}
