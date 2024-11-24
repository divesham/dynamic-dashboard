import React, { useState, useEffect } from "react";
import { GroupedReports } from "./GroupedReports";
import ReportGrid from "./ReportGrid";
import { parseCSVFromURL, parseCSVFile } from "../utils/csvHelper";
import "../styles/Dashboard.css";

interface UploadedFile {
  name: string;
  content: any[];
  type: "preloaded" | "uploaded";
  date: string;
  tags: string[];
}

const Dashboard: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>(null);
  const [uploadTags, setUploadTags] = useState<string>("");
  const [tagInput, setTagInput] = useState<string>("");
  const [filterTag, setFilterTag] = useState<string | null>(null);
  const [tabColors, setTabColors] = useState<Record<string, string>>({});
  const [tagColors, setTagColors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadPreloadedFiles = async () => {
      const fileNames = ["a.csv", "b.csv"];
      const data: UploadedFile[] = [];
      for (const fileName of fileNames) {
        const content = await parseCSVFromURL(`/folder/${fileName}`);
        data.push({
          name: fileName,
          content,
          type: "preloaded",
          date: new Date().toISOString(),
          tags: [],
        });
      }
      setFiles(data);
      if (data.length > 0) setActiveTab(data[0].name);
    };

    loadPreloadedFiles();
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
      Array.from(uploadedFiles).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          const parsedData = parseCSVFile(text);
          const tags = uploadTags.split(",").map((tag) => tag.trim());
          setFiles((prev) => [
            ...prev,
            {
              name: file.name,
              content: parsedData,
              type: "uploaded",
              date: new Date().toISOString(),
              tags: tags.filter((tag) => tag),
            },
          ]);
          setActiveTab(file.name);
          setUploadTags("");
        };
        reader.readAsText(file);
      });
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() === "" || !activeTab) return;
    setFiles((prevFiles) =>
      prevFiles.map((file) =>
        file.name === activeTab
          ? {
              ...file,
              tags: Array.from(new Set(file.tags.concat(tagInput.trim()))),
            }
          : file
      )
    );
    setTagInput("");
  };

  const handleColorChangeForTab = (tabName: string, color: string) => {
    setTabColors((prev) => ({ ...prev, [tabName]: color }));
  };

  const handleColorChangeForTag = (tagName: string, color: string) => {
    setTagColors((prev) => ({ ...prev, [tagName]: color }));
  };

  const handleFilterByTag = (tag: string) => {
    setFilterTag((prev) => (prev === tag ? null : tag));
  };

  const handleFileClick = (fileName: string) => {
    setActiveTab(fileName);
  };

  const filteredFiles = filterTag
    ? files.filter((file) => file.tags.includes(filterTag))
    : files;

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Dynamic CSV Dashboard</h2>

      <div className="upload-section">
        <input
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileUpload}
          className="file-input"
        />
      </div>

      {activeTab && (
        <div className="tag-management">
          <h4>
            Manage Tags for: <span className="active-tab">{activeTab}</span>
          </h4>
          <input
            type="text"
            placeholder="Add a tag"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="tag-input"
          />
          <button onClick={handleAddTag} className="add-tag-button">
            Add Tag
          </button>
        </div>
      )}

      <div className="customization-section">
        <div className="tab-colors">
          <h4>Customize Tab Colors:</h4>
          {files.map((file) => (
            <div key={file.name} className="color-row">
              <label>{file.name}: </label>
              <input
                type="color"
                value={tabColors[file.name] || "#ffffff"}
                onChange={(e) =>
                  handleColorChangeForTab(file.name, e.target.value)
                }
                className="color-picker"
              />
            </div>
          ))}
        </div>
        <div className="tag-colors">
          <h4>Customize Tag Colors:</h4>
          {Array.from(new Set(files.flatMap((file) => file.tags))).map(
            (tag) => (
              <div key={tag} className="color-row">
                <label>{tag}: </label>
                <input
                  type="color"
                  value={tagColors[tag] || "#ffffff"}
                  onChange={(e) => handleColorChangeForTag(tag, e.target.value)}
                  className="color-picker"
                />
              </div>
            )
          )}
        </div>
      </div>

      <div className="tags-section">
        <h4>All Tags:</h4>
        {Array.from(new Set(files.flatMap((file) => file.tags))).map((tag) => (
          <button
            key={tag}
            onClick={() => handleFilterByTag(tag)}
            className="tag-button"
            style={{ backgroundColor: tagColors[tag] || "lightgray" }}
          >
            {tag}
          </button>
        ))}
        {filterTag && (
          <button
            onClick={() => setFilterTag(null)}
            className="reset-filter-button"
          >
            Reset Filter
          </button>
        )}
      </div>

      {filteredFiles.length > 0 ? (
        <GroupedReports
          reports={filteredFiles}
          tabColors={tabColors}
          onFileClick={handleFileClick}
        />
      ) : (
        <p>No files match the selected tag.</p>
      )}

      {activeTab && (
        <div>
          <h3>
            Grid for <span className="active-tab">{activeTab}</span>
          </h3>
          <ReportGrid
            data={files.find((file) => file.name === activeTab)?.content || []}
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
