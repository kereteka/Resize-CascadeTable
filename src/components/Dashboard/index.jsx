import React, { createRef, useEffect, useRef, useState } from "react";
import { FaPlus, FaPlusSquare } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import { useResizeDetector } from "react-resize-detector";

const Dashboard = () => {
  const [tabs, setTabs] = useState([
    { name: "Tab 1", widgets: [] },
    { name: "Tab 2", widgets: [] },
    { name: "Tab 3", widgets: [] },
  ]);
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [selectedWidget, setSelectedWidget] = useState("");

  // const [width, setWidth] = useState(null);
  // const [height, setHeight] = useState(null);

  // const sizeRef = useRef([]);

  const handleAddTab = () => {
    const newTabName = `Tab ${tabs.length + 1}`;
    setTabs([...tabs, { name: newTabName, widgets: [] }]);
    setActiveTabIndex(tabs.length);
  };

  const handleRemoveTab = (index) => {
    const newTabs = [...tabs];
    newTabs.splice(index, 1);
    setTabs(newTabs);
    setActiveTabIndex(Math.min(activeTabIndex, newTabs.length - 1));
  };

  const handleTabClick = (index) => {
    setActiveTabIndex(index);
  };

  const handleWidgetSelect = (event) => {
    setSelectedWidget(event.target.value);
    const newTabs = [...tabs];
    const newTab = { ...newTabs[activeTabIndex] };
    newTab.widgets.push(event.target.value);
    newTabs[activeTabIndex] = newTab;
    setTabs(newTabs);
  };

  const handleRemoveWidget = (widgetIndex) => {
    const newTabs = [...tabs];
    const newTab = { ...newTabs[activeTabIndex] };
    newTab.widgets.splice(widgetIndex, 1);
    newTabs[activeTabIndex] = newTab;
    setTabs(newTabs);
  };

  const handleWidgetDragStart = (event, widgetIndex) => {
    event.dataTransfer.setData("widgetIndex", widgetIndex);
  };

  const handleWidgetDrop = (event, widgetDropIndex) => {
    const widgetIndex = event.dataTransfer.getData("widgetIndex");
    const newTabs = [...tabs];
    const newTab = { ...newTabs[activeTabIndex] };
    const widget = newTab.widgets.splice(widgetIndex, 1)[0];
    newTab.widgets.splice(widgetDropIndex, 0, widget);
    newTabs[activeTabIndex] = newTab;
    setTabs(newTabs);
  };

  const resizeHandler = (widgetIndex) => {
    return (entries) => {
      // Boyut değişiklikleri ile ilgili işlemleri burada yapabilirsiniz
      const { width, height } = entries[0].contentRect;
      console.log(width);
      //setWidth(width);
      const newTabs = [...tabs];
      newTabs.forEach((tab, index) => {
        tab.widgets.forEach((widget, i) => {
          // if (i !== widgetIndex) {
          //   setWidth(0);
          // } else setWidth(width);
        });
      });
    };
  };

  // useEffect(() => {
  //   // ResizeObserver'i kullanarak boyut değişikliklerini dinleme
  //   sizeRef.current.forEach((ref, index) => {
  //     const observer = new ResizeObserver(resizeHandler(index));
  //     observer.observe(ref);
  //     //console.log(index, "index");
  //   });

  //   // // Clean-up
  //   // return () => {
  //   //   sizeRef.current.forEach((ref) => {
  //   //     ref.disconnect();
  //   //   });
  //   // };
  // }, [tabs, width]);

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-gray-800 text-white py-4 flex justify-between items-center">
        <div className="flex space-x-4 ml-4">
          {tabs.map((tab, index) => (
            <>
              <div
                key={index}
                className={`cursor-pointer ${
                  index === activeTabIndex ? "font-bold" : ""
                }`}
                onClick={() => handleTabClick(index)}
              >
                Tab
              </div>
              {tabs.length > 1 && (
                <button
                  className="-mt-2 text-red-500 hover:text-red-600 "
                  onClick={() => handleRemoveTab(index)}
                >
                  <HiOutlineTrash />
                </button>
              )}
            </>
          ))}
          <button
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
            onClick={handleAddTab}
          >
            <FaPlus />
          </button>
        </div>
        <div className="mr-24 relative  hover:brightness-90 cursor-pointer bg-white w-6 h-6">
          <FaPlusSquare className=" text-green-400 text-4xl absolute z-40 cursor-pointer -mt-1 -ml-2 " />
          <select
            className=" bg-green-500 z-50 bg-transparent absolute w-10 h-10 active:translate-y-10 cursor-pointer appearance-none text-transparent outline-none  "
            value="none"
            onChange={handleWidgetSelect}
          >
            <option
              className=" text-black cursor-pointer hidden "
              value="none"
            ></option>
            <option className=" cursor-pointer" value="List Widget">
              List Widget
            </option>
            <option className=" cursor-pointer" value="Chart Widget">
              Chart Widget
            </option>
            <option className=" cursor-pointer" value="3D Viewer">
              3D Viewer
            </option>
          </select>
        </div>
      </div>
      <div className="flex-grow flex overflow-hidden">
        {tabs.map((tab, index) => (
          <div
            key={index}
            className={`w-full h-full flex-shrink-0 overflow-hidden ${
              index === activeTabIndex ? "" : "hidden"
            }`}
          >
            {tab.widgets.length === 0 && (
              <div className="h-full flex justify-center items-center">
                <span className="text-gray-500 italic">
                  No widgets added yet.
                </span>
              </div>
            )}
            {/* overflow-scroll shrink */}
            <div className="flex gap-5 ">
              {tab.widgets.map((widget, widgetIndex) => (
                <div
                  // ref={(ref) => (sizeRef.current[widgetIndex] = ref)}
                  key={widgetIndex}
                  className="bg-white rounded-lg p-4 h-[300px]  border resize overflow-auto  "
                  draggable
                  onDragStart={(event) =>
                    handleWidgetDragStart(event, widgetIndex)
                  }
                  onDragOver={(event) => event.preventDefault()}
                  onDrop={(event) => handleWidgetDrop(event, widgetIndex)}
                  onMouseDown={() => setSelectedWidget(widgetIndex)}
                >
                  {widget}
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-full mt-2"
                    onClick={() => handleRemoveWidget(widgetIndex)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
